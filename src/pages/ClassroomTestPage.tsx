/**
 * ClassroomTestPage — WO-UX-CLASSROOM-001
 *
 * Route: /classroom-test — Founder review PROTOTYPE ONLY.
 * Static test data, CSS-only animations, no microphone permission, no
 * ElevenLabs, no Supabase, no Stripe. Does not replace the current course
 * player (/course/... and /professor-live-test are untouched).
 */
import { useEffect, useState } from 'react';
import { CT } from '@/components/classroom-test/theme';
import ClassroomHeader from '@/components/classroom-test/ClassroomHeader';
import ProfessorLiveSidebar from '@/components/classroom-test/ProfessorLiveSidebar';
import ProfessorStage from '@/components/classroom-test/ProfessorStage';
import DigitalWhiteboard from '@/components/classroom-test/DigitalWhiteboard';
import ProfessorTranscriptPanel from '@/components/classroom-test/ProfessorTranscriptPanel';
import SuggestedPromptsPanel from '@/components/classroom-test/SuggestedPromptsPanel';
import StudentNotesPanel from '@/components/classroom-test/StudentNotesPanel';
import VoiceControlBar from '@/components/classroom-test/VoiceControlBar';

function useSessionTimer() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ClassroomTestPage() {
  const elapsed = useSessionTimer();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(ellipse 60% 40% at 20% 0%, rgba(74,144,245,.06), transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 10%, rgba(139,92,246,.05), transparent 60%),
          ${CT.bg}
        `,
        color: CT.fg,
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ClassroomHeader elapsed={elapsed} />

      <main className="ct-grid" style={{ flex: 1, padding: 16, width: '100%', maxWidth: 1600, margin: '0 auto' }}>
        <ProfessorLiveSidebar />

        {/* Center column: stage + whiteboard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <ProfessorStage />
          <DigitalWhiteboard />
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <ProfessorTranscriptPanel />
          <SuggestedPromptsPanel />
          <StudentNotesPanel />
        </div>
      </main>

      <VoiceControlBar elapsed={elapsed} />

      {/* Prototype animations + responsive grid (scoped: ct- prefix) */}
      <style>{`
        .ct-grid {
          display: grid;
          grid-template-columns: 270px minmax(0, 1fr) 300px;
          gap: 14px;
          align-items: start;
        }
        @media (max-width: 1180px) {
          .ct-grid { grid-template-columns: 250px minmax(0, 1fr); }
          .ct-grid > :nth-child(3) { grid-column: 1 / -1; display: grid !important; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
        }
        @media (max-width: 760px) {
          .ct-grid { grid-template-columns: 1fr; }
          .ct-grid > :nth-child(3) { grid-template-columns: 1fr; }
          .ct-hide-mobile { display: none; }
        }
        @keyframes ct-wave {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
        .ct-wave-bar { animation: ct-wave 0.9s ease-in-out infinite; }
        @keyframes ct-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .45; transform: scale(.8); }
        }
        .ct-pulse-dot { animation: ct-pulse 1.6s ease-in-out infinite; }
        @keyframes ct-blink { 0%, 60% { opacity: 1; } 61%, 100% { opacity: 0; } }
        .ct-cursor { animation: ct-blink 1s step-end infinite; }
        .ct-mic-ring {
          position: absolute; inset: -8px; border-radius: 50%;
          border: 2px solid rgba(74,144,245,.45);
          animation: ct-ring 2.2s ease-out infinite;
          pointer-events: none;
        }
        .ct-mic-ring-2 { animation-delay: 1.1s; border-color: rgba(139,92,246,.4); }
        @keyframes ct-ring {
          0% { transform: scale(.85); opacity: .9; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .ct-chip:hover { border-color: rgba(74,144,245,.4) !important; color: #EDF2F7 !important; }
        .ct-tool:hover { border-color: rgba(74,144,245,.45) !important; color: #EDF2F7 !important; background: rgba(74,144,245,.1) !important; }
        @media (prefers-reduced-motion: reduce) {
          .ct-wave-bar, .ct-pulse-dot, .ct-cursor, .ct-mic-ring { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
