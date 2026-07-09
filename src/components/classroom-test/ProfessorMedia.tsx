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
 * visibly alive: subtle breathing when idle, speech motion when speaking.
 * Everything degrades gracefully to the static poster.
 *
 * AUDIO-REACTIVE (Option A): the "speaking" clip's mouth was pre-rendered to a
 * fixed script, so on its own it can't match live ElevenLabs TTS. When a `getLevel`
 * function is supplied (live output volume 0..1), we PACE the clip to the real
 * voice — it plays (mouth moving) only while he's actually making sound, freezes on
 * pauses, and its speed rises with loudness. That makes the motion track the RHYTHM
 * of whatever he's saying, for any-length lesson. True per-syllable lip-sync is a
 * later upgrade via the swappable `source` prop (live TTS → talking-head avatar).
 * The speaking clip is ALWAYS muted — the audible voice is ElevenLabs, never the clip.
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
  /** retained for API compatibility; the speaking clip is always muted (voice = ElevenLabs) */
  muted?: boolean;
  /** swap point for a future live/production media pipeline */
  source?: ProfessorMediaSource;
  className?: string;
  /**
   * Live TTS output level 0..1. When provided, the professor's mouth motion is
   * gated + paced by the REAL voice so it matches the speech rhythm.
   */
  getLevel?: () => number;
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
  source = TEST_SOURCE,
  className = "",
  getLevel,
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
        speak.playbackRate = 1;
      }
    }
  }, [speaking, useVideo]);

  // AUDIO-REACTIVE pacing: while speaking, follow the live output volume so the
  // mouth moves in time with the actual voice and freezes on pauses.
  useEffect(() => {
    if (!useVideo || !speaking || !getLevel) return;
    const speak = speakRef.current;
    if (!speak) return;
    let raf = 0;
    let smoothed = 0;
    const SILENCE = 0.045; // below this = a pause → freeze the mouth
    const loop = () => {
      const raw = getLevel();
      const v = Math.max(0, Math.min(1, Number.isFinite(raw) ? raw : 0));
      smoothed += (v - smoothed) * 0.3; // envelope-follow to avoid jitter
      if (smoothed > SILENCE) {
        if (speak.paused) {
          const p = speak.play();
          if (p) p.catch(() => {});
        }
        // louder → faster mouth (0.8x .. ~1.6x)
        speak.playbackRate = 0.8 + Math.min(smoothed * 1.8, 0.8);
      } else if (!speak.paused) {
        speak.pause(); // silence between words/sentences → hold still
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [useVideo, speaking, getLevel]);

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
      {/* Speaking layer — paced by live voice; ALWAYS muted (audio = ElevenLabs) */}
      <video
        ref={speakRef}
        src={source.speaking}
        poster={source.poster}
        loop
        muted
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
