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
}

export function useClassroomVoice(): ClassroomVoice {
  const [status, setStatus] = useState<ClassroomVoiceStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<{ role: "user" | "agent"; message: string }[]>([]);
  const startingRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setStatus("connected");
      setError(null);
      startingRef.current = false;
    },
    onDisconnect: () => {
      setStatus("idle");
      startingRef.current = false;
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
      const sessionOpts: any = {
        overrides: {
          agent: {
            prompt: { prompt: buildProfessorSystemPrompt(CURRENT_LESSON) },
            language: "en",
          },
          tts: { voiceId: DIDIER_VOICE_EN, stability: 0.71, similarityBoost: 0.55 },
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
    try {
      await conversation.endSession();
    } catch {
      /* ignore */
    }
    setStatus("idle");
  }, [conversation]);

  const clearError = useCallback(() => setError(null), []);

  return {
    status,
    isSpeaking: conversation.isSpeaking,
    error,
    transcript,
    start,
    stop,
    clearError,
  };
}

export default useClassroomVoice;
