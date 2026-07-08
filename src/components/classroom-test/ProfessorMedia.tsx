import { useEffect, useRef, useState } from "react";
import {
  professorIdleClip as idleClip,
  professorSpeakingClip as speakingClip,
  professorPoster as posterImg,
} from "./media/professorAssets";

/**
 * ProfessorMedia — the animated Professor Didier media layer (WO-UX-CLASSROOM-003).
 *
 * Renders two crossfaded <video> layers (idle + speaking) so the professor is
 * visibly alive: subtle breathing when idle, lip-synced speech + gestures when
 * speaking. Everything degrades gracefully to the static poster.
 *
 * TEST MODE: the sources below are pre-rendered static test clips. They are wired
 * through a swappable `ProfessorMediaSource` so a future PRODUCTION pipeline
 * (live TTS → talking-head/avatar) can replace them with zero UI changes — pass a
 * different `source` (e.g. a live MediaStream URL) and the rest of the classroom
 * is unaffected. No runtime voice/AI calls happen here.
 */
export interface ProfessorMediaSource {
  idle: string;
  speaking: string;
  poster: string;
}

const TEST_SOURCE: ProfessorMediaSource = {
  idle: idleClip,
  speaking: speakingClip,
  poster: posterImg,
};

interface Props {
  /** true → professor is actively speaking; false → idle/listening */
  speaking: boolean;
  /** mute the speaking clip's audio (browsers require a user gesture to unmute) */
  muted?: boolean;
  /** swap point for a future live/production media pipeline */
  source?: ProfessorMediaSource;
  className?: string;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

export default function ProfessorMedia({
  speaking,
  muted = true,
  source = TEST_SOURCE,
  className = "",
}: Props) {
  const idleRef = useRef<HTMLVideoElement>(null);
  const speakRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const useVideo = !failed && !reducedMotion;

  // Drive playback from the speaking state. Idle always loops quietly underneath.
  useEffect(() => {
    if (!useVideo) return;
    const speak = speakRef.current;
    const idle = idleRef.current;
    if (idle) {
      const p = idle.play();
      if (p) p.catch(() => {});
    }
    if (speak) {
      if (speaking) {
        speak.currentTime = 0;
        const p = speak.play();
        if (p) p.catch(() => {});
      } else {
        speak.pause();
      }
    }
  }, [speaking, useVideo]);

  // Keep the speaking clip's mute state in sync (unmuting must follow a gesture).
  useEffect(() => {
    if (speakRef.current) speakRef.current.muted = muted;
  }, [muted, speaking]);

  // Static fallback: reduced-motion preference or a video load failure.
  if (!useVideo) {
    return (
      <img
        src={source.poster}
        alt="Professor Didier"
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Idle layer — always playing, muted, looped */}
      <video
        ref={idleRef}
        src={source.idle}
        poster={source.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
          speaking ? "opacity-0" : "opacity-100"
        }`}
      />
      {/* Speaking layer — plays (with optional audio) while speaking */}
      <video
        ref={speakRef}
        src={source.speaking}
        poster={source.poster}
        loop
        muted={muted}
        playsInline
        preload="auto"
        onError={() => setFailed(true)}
        className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
          speaking ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
