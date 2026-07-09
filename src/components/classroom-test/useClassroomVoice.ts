import { useCallback, useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { buildProfessorSystemPrompt, CURRENT_LESSON } from "./lessonContext";

/**
 * useClassroomVoice — LIVE Professor Didier™ voice for the /classroom-test PREVIEW.
 * WO-UX-CLASSROOM (Founder voice-test). Isolated to the classroom test path.
 *
 * This is the ONLY place the preview talks to ElevenLabs. It mirrors the proven
 * production lesson path (ChapterView): request mic → get a signed URL from the
 * deployed `elevenlabs-conversation-token` edge function (verify_jwt=false, so it
 * works for the unauthenticated preview) → start an @elevenlabs/react session with
 * the constrained lesson prompt + the official Professor Didier™ English voice.
 * Falls back to a public VITE_ELEVENLABS_AGENT_ID only if the signed URL is
 * unavailable. Every failure path sets a human-readable `error` so the preview can
 * SHOW why voice didn't start instead of doing nothing.
 *
 * No Supabase schema, no Stripe, no production release wiring. Test path only.
 */

export type ClassroomVoiceStatus = "idle" | "connecting" | "connected" | "error";

// Official Professor Didier™ English voice id (same one the production lesson uses).
const DIDIER_VOICE_EN = "bQxW1c7YCr6VQgQhw8KX";

// The agent has no auto-greeting, and first_message override is disallowed by its
// config. So once the socket is live we nudge Prof. Didier to greet the student and
// start the lesson OUT LOUD — otherwise he connects and silently waits for the
// student to speak first, which reads as "connected but no sound".
const KICKOFF_MESSAGE =
  "I've just joined the classroom and I'm ready to begin. Please welcome me warmly and start teaching today's lesson — \"What is Scrum?\" — right now, out loud.";

const TOKEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const FALLBACK_AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string | undefined;

export interface ClassroomVoice {
  status: ClassroomVoiceStatus;
  isSpeaking: boolean;
  error: string | null;
  transcript: { role: "user" | "agent"; message: string }[];
  start: () => void;
  stop: () => void;
  clearError: () => void;
  /** Live TTS output level 0..1 — drives the audio-reactive professor mouth. */
  getOutputVolume: () => number;
  /** Mute/unmute the professor's ElevenLabs audio output (not the video clip). */
  setMuted: (m: boolean) => void;
}

export function useClassroomVoice(): ClassroomVoice {
  const [status, setStatus] = useState<ClassroomVoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<{ role: "user" | "agent"; message: string }[]>([]);
  const startingRef = useRef(false);
  const stoppingRef = useRef(false);
  // Ref to the live conversation so onConnect (declared before `conversation`) can
  // call its methods (e.g. sendUserMessage for the kickoff).
  const convRef = useRef<{ sendUserMessage?: (t: string) => void } | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setStatus("connected");
      setError(null);
      startingRef.current = false;
      // Kick the professor into greeting + teaching immediately (see KICKOFF_MESSAGE).
      // Small delay so the agent is ready to accept the message after init.
      setTimeout(() => {
        try {
          convRef.current?.sendUserMessage?.(KICKOFF_MESSAGE);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("[classroom-preview] kickoff sendUserMessage failed:", e);
        }
      }, 400);
    },
    onDisconnect: (details?: unknown) => {
      startingRef.current = false;
      // If the session dropped on its own (not a user tap on End), surface WHY on
      // screen instead of silently going idle — e.g. an ElevenLabs 1008 close whose
      // reason is "Override for field 'X' is not allowed by config."
      if (!stoppingRef.current) {
        const d = details as { reason?: string; message?: string; context?: { reason?: string; code?: number } };
        const why = d?.message || d?.context?.reason || (typeof d?.reason === "string" ? d.reason : "");
        if (why) {
          setError(`Professor Didier disconnected: ${why}`);
          setStatus("error");
          return;
        }
      }
      stoppingRef.current = false;
      setStatus("idle");
    },
    onMessage: ({ message, source }: { message: string; source: string }) => {
      const cleaned = (message || "").replace(/<[^>]+>/g, "").trim();
      if (cleaned) {
        setTranscript((p) => [...p, { role: source === "ai" ? "agent" : "user", message: cleaned }]);
      }
    },
    onError: (e: unknown) => {
      // eslint-disable-next-line no-console
      console.error("[classroom-preview] ElevenLabs error:", e);
      const msg = typeof e === "string" ? e : (e as { message?: string })?.message;
      setError(msg || "The voice connection dropped. Tap Start to try again.");
      setStatus("error");
      startingRef.current = false;
    },
  });

  // Keep the ref pointed at the current conversation so onConnect can drive it.
  convRef.current = conversation as unknown as { sendUserMessage?: (t: string) => void };

  // Always tear the session down when the preview unmounts.
  useEffect(() => {
    return () => {
      conversation.endSession().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = useCallback(async () => {
    if (startingRef.current || status === "connecting" || status === "connected") return;
    startingRef.current = true;
    setError(null);
    setTranscript([]);
    setStatus("connecting");

    try {
      // 1) Microphone permission — the browser prompts here. Explicit constraints
      //    (not bare `true`) because Safari throws on `{ audio: true }`.
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
      } catch (micErr: unknown) {
        const name = (micErr as { name?: string })?.name;
        if (name === "NotAllowedError" || name === "SecurityError") {
          setError("Microphone permission was blocked. Allow mic access in your browser, then tap Start again.");
        } else if (name === "NotFoundError") {
          setError("No microphone was found. Connect a microphone and tap Start again.");
        } else {
          const m = (micErr as { message?: string })?.message;
          setError(`Could not access the microphone: ${m || name || "unknown error"}.`);
        }
        setStatus("error");
        startingRef.current = false;
        return;
      }

      // Unlock the Safari/iOS WebAudio context before connecting.
      try {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (AC) {
          const ctx = new AC();
          await ctx.resume();
        }
      } catch {
        /* non-fatal */
      }

      // 2) Signed URL from the deployed edge function (primary path — works for the
      //    unauthenticated preview because the function is verify_jwt=false).
      let signedUrl: string | null = null;
      try {
        const res = await fetch(TOKEN_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(SUPABASE_KEY ? { Authorization: `Bearer ${SUPABASE_KEY}` } : {}),
          },
        });
        const data = (await res.json().catch(() => ({}))) as { signed_url?: string; error?: string };
        if (data?.signed_url) {
          signedUrl = data.signed_url;
        } else {
          // eslint-disable-next-line no-console
          console.warn("[classroom-preview] token function returned no signed_url:", data);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("[classroom-preview] signed-url fetch failed, will try public agentId:", e);
      }

      // 3) Need EITHER a signed URL OR a public agent id to connect.
      if (!signedUrl && !FALLBACK_AGENT_ID) {
        setError(
          "Voice isn't configured for this preview: the token service returned no signed URL and VITE_ELEVENLABS_AGENT_ID is not set. Verify the ElevenLabs secrets on the token function (or set the preview env var).",
        );
        setStatus("error");
        startingRef.current = false;
        return;
      }

      // 4) Start the session with the constrained lesson prompt + Professor Didier™ voice.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // IMPORTANT: only send overrides the agent's config actually allows. The
      // Professor Didier agent whitelists prompt, language, and tts.voiceId — but
      // NOT stability / similarityBoost. Sending those makes ElevenLabs accept the
      // init and then immediately close the socket with code 1008
      // ("Override for field 'stability' is not allowed by config."), which reads as
      // "connects for a second then drops." Keep this override set minimal.
      const sessionOpts: any = {
        overrides: {
          agent: {
            prompt: { prompt: buildProfessorSystemPrompt(CURRENT_LESSON) },
            language: "en",
          },
          tts: { voiceId: DIDIER_VOICE_EN },
        },
      };
      if (signedUrl) sessionOpts.signedUrl = signedUrl;
      else sessionOpts.agentId = FALLBACK_AGENT_ID;

      await conversation.startSession(sessionOpts);
      // status flips to "connected" via onConnect
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error("[classroom-preview] startSession failed:", e);
      const m = (e as { message?: string })?.message;
      setError(m || "Failed to start the voice session. Check your connection and try again.");
      setStatus("error");
      startingRef.current = false;
    }
  }, [conversation, status]);

  const stop = useCallback(async () => {
    stoppingRef.current = true; // mark this as a user-initiated end so onDisconnect stays quiet
    try {
      await conversation.endSession();
    } catch {
      /* ignore */
    }
    setStatus("idle");
  }, [conversation]);

  const clearError = useCallback(() => setError(null), []);

  // Live output level (0..1) of the professor's ElevenLabs audio, for the
  // audio-reactive mouth. Returns 0 when not connected / unavailable.
  const getOutputVolume = useCallback(() => {
    try {
      const v = (conversation as unknown as { getOutputVolume?: () => number }).getOutputVolume?.();
      return typeof v === "number" && Number.isFinite(v) ? v : 0;
    } catch {
      return 0;
    }
  }, [conversation]);

  // Mute/unmute the professor's VOICE (ElevenLabs output), not the muted video clip.
  const setMuted = useCallback((m: boolean) => {
    try {
      (conversation as unknown as { setVolume?: (o: { volume: number }) => void }).setVolume?.({ volume: m ? 0 : 1 });
    } catch {
      /* ignore */
    }
  }, [conversation]);

  return {
    status,
    isSpeaking: conversation.isSpeaking,
    error,
    transcript,
    start,
    stop,
    clearError,
    getOutputVolume,
    setMuted,
  };
}

export default useClassroomVoice;
