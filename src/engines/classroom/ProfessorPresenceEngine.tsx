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
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 20, marginTop: 4 }}>
      {Array.from({ length: 18 }).map((_, i) => {
        const sin = Math.sin((i / 18) * Math.PI * 2);
        const h = active ? (speaking ? 4 + Math.abs(sin) * 14 : 2 + Math.abs(sin) * 6) : 2;
        return (
          <div key={i} style={{
            width: 2.5, borderRadius: 99, background: speaking ? '#4A90F5' : '#22C98A',
            height: h,
            animation: active ? `wave${i % 5} ${0.6 + (i % 5) * 0.12}s ease-in-out infinite alternate` : 'none',
            transition: 'background 0.4s',
          }} />
        );
      })}
      <style>{`
        @keyframes wave0 { from{height:2px} to{height:16px} }
        @keyframes wave1 { from{height:3px} to{height:10px} }
        @keyframes wave2 { from{height:2px} to{height:18px} }
        @keyframes wave3 { from{height:4px} to{height:12px} }
        @keyframes wave4 { from{height:2px} to{height:8px} }
      `}</style>
    </div>
  );
}

export default function ProfessorPresenceEngine({
  status, isConnected, isSpeaking,
  professorName = 'Professor Didier™',
  caption = '',
}: ProfessorPresenceEngineProps) {
  const statusLabel = isSpeaking
    ? 'Speaking...'
    : isConnected
    ? 'Listening...'
    : status === 'connecting'
    ? 'Connecting...'
    : 'Ready';

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── PROFESSOR VISUAL AREA ─────────────────────────────────── */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {/* Classroom background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${classroomBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'brightness(0.25) saturate(0.6)',
        }} />

        {/* Ambient glow — changes with speaking state */}
        <div style={{
          position: 'absolute', inset: 0,
          background: isSpeaking
            ? 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(74,144,245,.28) 0%, transparent 65%)'
            : isConnected
            ? 'radial-gradient(ellipse 70% 80% at 50% 100%, rgba(34,201,138,.18) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 60% 70% at 50% 100%, rgba(74,144,245,.10) 0%, transparent 60%)',
          transition: 'background 1s ease',
          pointerEvents: 'none',
        }} />

        {/* Purple depth gradient — cinematic depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,8,30,.5) 0%, transparent 35%, transparent 55%, rgba(8,14,26,.85) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Professor photo — centered, fills from waist up */}
        <img
          src={professorImg}
          alt="Professor Didier™"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '92%',
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'center bottom',
            filter: isConnected ? 'drop-shadow(0 0 32px rgba(74,144,245,.35))' : 'none',
            transition: 'filter 0.8s ease',
            zIndex: 1,
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />

        {/* Aladiah watermark */}
        <div style={{
          position: 'absolute', top: 14, right: 14, zIndex: 2,
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #4A90F5, #9B59B6)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 900, color: '#fff',
          opacity: 0.7,
          boxShadow: '0 4px 12px rgba(0,0,0,.4)',
        }}>
          A
        </div>

        {/* LIVE badge */}
        {isConnected && (
          <div style={{
            position: 'absolute', top: 14, left: 14, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(8,14,26,.75)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(239,68,68,.45)',
            borderRadius: 99, padding: '3px 10px',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#EF4444',
              boxShadow: '0 0 6px #EF4444',
              animation: 'liveDot 1.2s infinite',
            }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: '#EF4444', letterSpacing: '.08em' }}>LIVE</span>
          </div>
        )}

        {/* Professor name + status — lower overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2,
          padding: '24px 18px 16px',
          background: 'linear-gradient(to top, rgba(8,14,26,.96) 0%, rgba(8,14,26,.6) 70%, transparent 100%)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#EDF2F7', marginBottom: 2 }}>
            {professorName}
          </div>
          <div style={{ fontSize: 10, color: '#4A90F5', fontWeight: 600, letterSpacing: '.06em', marginBottom: 6 }}>
            Founder & Lead Professor · Aladiah Academy
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(8,14,26,.6)',
              border: `1px solid ${isSpeaking ? 'rgba(74,144,245,.4)' : isConnected ? 'rgba(34,201,138,.35)' : 'rgba(255,255,255,.12)'}`,
              borderRadius: 99, padding: '3px 10px',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#8596AD',
                animation: isConnected ? 'statusPulse 2s infinite' : 'none',
              }} />
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: isSpeaking ? '#4A90F5' : isConnected ? '#22C98A' : '#8596AD',
              }}>
                {statusLabel}
              </span>
            </div>
            <AudioWaveform active={isConnected} speaking={isSpeaking} />
          </div>
        </div>
      </div>

      {/* ── TRANSCRIPT CARD ───────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        background: 'rgba(8,14,26,.95)',
        borderTop: '1px solid #1E2D47',
        padding: '14px 18px',
        minHeight: 88,
      }}>
        {caption ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4A90F5', marginBottom: 6 }}>
              Professor Didier:
            </div>
            <p style={{
              fontSize: 12, color: '#EDF2F7', lineHeight: 1.6,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {caption}
            </p>
            <div style={{ display: 'flex', gap: 2, alignItems: 'center', marginTop: 8 }}>
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} style={{
                  width: 2, borderRadius: 99,
                  height: 3 + Math.abs(Math.sin(i * 0.7)) * 9,
                  background: `rgba(74,144,245,${0.3 + Math.abs(Math.sin(i * 0.7)) * 0.7})`,
                  animation: isSpeaking ? `twave${i % 4} ${0.5 + (i % 4) * 0.1}s ease-in-out infinite alternate` : 'none',
                }} />
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontSize: 11, color: '#4A5E7A', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
            {isConnected
              ? 'Professor Didier is preparing to speak…'
              : 'Start the class — Professor Didier will greet you and begin teaching.'}
          </p>
        )}
      </div>

      <style>{`
        @keyframes liveDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes twave0 { from{height:3px} to{height:12px} }
        @keyframes twave1 { from{height:2px} to{height:8px} }
        @keyframes twave2 { from{height:3px} to{height:14px} }
        @keyframes twave3 { from{height:2px} to{height:7px} }
      `}</style>
    </div>
  );
}
