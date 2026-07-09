import { useCallback, useEffect, useRef, useState } from "react";
import { buildProfessorSystemPrompt, CURRENT_LESSON } from "./lessonContext";
import { SIMLI_ENABLED, SIMLI_API_KEY, SIMLI_FACE_ID } from "./simliConfig";

/**
 * useSimliProfessor — OPTION B prototype: a REAL talking-head of Professor Didier
 * (Simli) whose lips are driven by the live ElevenLabs voice.
 *
 * Pipeline:
 *   mic → ElevenLabs conversational agent (direct WS) → agent audio (pcm_16000)
 *        → Simli sendAudioData → Simli renders the lip-synced face + plays the audio.
 *   ElevenLabs stays the VOICE; Simli is only the face. Local EL playback is not used
 *   (Simli emits the audio), so there is no echo.
 *
 * SAFETY / STAGING:
 *  - Entirely INERT unless SIMLI_ENABLED (both Preview env vars present). start() no-ops otherwise.
 *  - The simli-client SDK is loaded via a runtime dynamic import (no bundizip dep), so it can
 *    never break the Vercel build. Any failure (import, token, WebRTC, quota) sets `error` and
 *    status "error" — the classroom then falls back to Option A.
 *  - No secrets in source; key + face id come only from import.meta.env (see simliConfig).
 */

export type SimliStatus = "idle" | "connecting" | "connected" | "error";

// esm.sh serves the package as an ES module at runtime — avoids a package.json dep that
// could fail `npm ci` on Vercel. Pinned major to reduce API drift; verified during QA.
const SIMLI_CDN = "https://esm.sh/simli-client@1";

const DIDIER_VOICE_EN = "bQxW1c7YCr6VQgQhw8KX";
const KICKOFF_MESSAGE =
  "I've just joined the classroom and I'm ready to begin. Please welcome me warmly and start teaching today's lesson — \"What is Scrum?\" — right now, out loud.";

const TOKEN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-conversation-token`;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export interface SimliProfessor {
  status: SimliStatus;
  isSpeaking: boolean;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  start: () => void;
  stop: () => void;
  clearError: () => void;
  setMuted: (m: boolean) => void;
}

// ── audio helpers ────────────────────────────────────────────────────────────
function downsampleToPCM16(input: Float32Array, inRate: number, outRate = 16000): Int16Array {
  if (inRate === outRate) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }
  const ratio = inRate / outRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Int16Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const s = Math.max(-1, Math.min(1, input[Math.floor(i * ratio)]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

function int16ToBase64(int16: Int16Array): string {
  const bytes = new Uint8Array(int16.buffer);
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)) as unknown as number[]);
  }
  return btoa(bin);
}

function base64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function useSimliProfessor(): SimliProfessor {
  const [status, setStatus] = useState<SimliStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const clientRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const procRef = useRef<ScriptProcessorNode | null>(null);
  const speakTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startingRef = useRef(false);

  const fail = useCallback((msg: string) => {
    setError(msg);
    setStatus("error");
    startingRef.current = false;
  }, []);

  const teardown = useCallback(() => {
    try { wsRef.current?.close(); } catch { /* ignore */ }
    wsRef.current = null;
    try { procRef.current?.disconnect(); } catch { /* ignore */ }
    procRef.current = null;
    try { micStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch { /* ignore */ }
    micStreamRef.current = null;
    try { audioCtxRef.current?.close(); } catch { /* ignore */ }
    audioCtxRef.current = null;
    try { clientRef.current?.ClearBuffer?.(); } catch { /* ignore */ }
    try { (clientRef.current?.close || clientRef.current?.stop)?.call(clientRef.current); } catch { /* ignore */ }
    clientRef.current = null;
  }, []);

  const markSpeaking = useCallback(() => {
    setIsSpeaking(true);
    if (speakTimerRef.current) clearTimeout(speakTimerRef.current);
    speakTimerRef.current = setTimeout(() => setIsSpeaking(false), 500);
  }, []);

  const start = useCallback(async () => {
    if (!SIMLI_ENABLED) {
      fail("Simli isn't configured (missing VITE_SIMLI_API_KEY / VITE_SIMLI_FACE_ID).");
      return;
    }
    if (startingRef.current || status === "connecting" || status === "connected") return;
    startingRef.current = true;
    setError(null);
    setStatus("connecting");

    try {
      // 1) Mic (student input + a user gesture to unlock audio playback).
      let mic: MediaStream;
      try {
        mic = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        micStreamRef.current = mic;
      } catch (e: unknown) {
        const name = (e as { name?: string })?.name;
        fail(name === "NotAllowedError" ? "Microphone permission was blocked. Allow mic access and try again." : "No microphone available.");
        return;
      }

      // 2) Load the Simli SDK at runtime (no bundled dep) and open the avatar session.
      let mod: any;
      try {
        mod = await import(/* @vite-ignore */ SIMLI_CDN);
      } catch (e) {
        fail("Couldn't load the Simli avatar SDK. Falling back to the standard professor.");
        return;
      }
      const SimliClient = mod.SimliClient || mod.default?.SimliClient || mod.default;
      const generateSimliSessionToken = mod.generateSimliSessionToken || mod.default?.generateSimliSessionToken;
      if (!SimliClient) { fail("Simli SDK loaded but no client export was found."); return; }

      const cfg = { faceId: SIMLI_FACE_ID, handleSilence: true, maxSessionLength: 3600, maxIdleTime: 300 };
      let client: any;
      try {
        if (typeof generateSimliSessionToken === "function") {
          // Newer token-based API (docs.simli.com).
          const tok = await generateSimliSessionToken({ apiKey: SIMLI_API_KEY, config: cfg });
          const sessionToken = tok?.session_token || tok;
          client = new SimliClient(sessionToken, videoRef.current, audioRef.current, null);
          await client.start();
        } else {
          // Older Initialize-based API (npm simli-client README).
          client = new SimliClient();
          client.Initialize({ apiKey: SIMLI_API_KEY, faceID: SIMLI_FACE_ID, ...cfg, videoRef: videoRef.current, audioRef: audioRef.current });
          await client.start();
        }
      } catch (e: unknown) {
        fail(`Simli session couldn't start: ${(e as { message?: string })?.message || "unknown error"}.`);
        return;
      }
      clientRef.current = client;

      // 3) ElevenLabs conversation over a direct WS so we can forward the agent's
      //    raw pcm_16000 audio to Simli. (The SDK plays audio itself; we can't tap it.)
      let signedUrl: string | null = null;
      try {
        const res = await fetch(TOKEN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...(SUPABASE_KEY ? { Authorization: `Bearer ${SUPABASE_KEY}` } : {}) },
        });
        signedUrl = (await res.json())?.signed_url || null;
      } catch { /* handled below */ }
      if (!signedUrl) { fail("Couldn't get an ElevenLabs voice session for the avatar."); return; }

      const ws = new WebSocket(signedUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: "conversation_initiation_client_data",
          conversation_config_override: {
            agent: { prompt: { prompt: buildProfessorSystemPrompt(CURRENT_LESSON) }, language: "en" },
            tts: { voice_id: DIDIER_VOICE_EN },
          },
        }));
      };

      ws.onmessage = (evt) => {
        let msg: any;
        try { msg = JSON.parse(evt.data); } catch { return; }
        switch (msg.type) {
          case "conversation_initiation_metadata":
            setStatus("connected");
            startingRef.current = false;
            // Kick Prof Didier into greeting + teaching so there's immediate speech.
            setTimeout(() => { try { ws.send(JSON.stringify({ type: "user_message", text: KICKOFF_MESSAGE })); } catch { /* ignore */ } }, 400);
            break;
          case "audio": {
            const b64 = msg.audio_event?.audio_base_64 || msg.audio_event?.audio_base64 || msg.audio;
            if (b64 && clientRef.current?.sendAudioData) {
              try { clientRef.current.sendAudioData(base64ToUint8(b64)); markSpeaking(); } catch { /* ignore */ }
            }
            break;
          }
          case "interruption":
            try { clientRef.current?.ClearBuffer?.(); } catch { /* ignore */ }
            setIsSpeaking(false);
            break;
          case "ping": {
            const id = msg.ping_event?.event_id;
            if (id != null) { try { ws.send(JSON.stringify({ type: "pong", event_id: id })); } catch { /* ignore */ } }
            break;
          }
          default:
            break;
        }
      };
      ws.onerror = () => { if (status !== "connected") fail("The ElevenLabs voice connection failed."); };
      ws.onclose = (e) => {
        if (status === "connected" && e.code === 1008) {
          fail(`Professor Didier disconnected: ${e.reason || "voice config not allowed"}.`);
        }
      };

      // 4) Mic → PCM16 16k → ElevenLabs (so the student can talk back).
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      await ctx.resume().catch(() => {});
      const srcNode = ctx.createMediaStreamSource(mic);
      const proc = ctx.createScriptProcessor(4096, 1, 1);
      procRef.current = proc;
      const mute = ctx.createGain();
      mute.gain.value = 0; // don't echo the mic to speakers
      proc.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const pcm = downsampleToPCM16(e.inputBuffer.getChannelData(0), ctx.sampleRate, 16000);
        try { wsRef.current.send(JSON.stringify({ user_audio_chunk: int16ToBase64(pcm) })); } catch { /* ignore */ }
      };
      srcNode.connect(proc);
      proc.connect(mute);
      mute.connect(ctx.destination);
    } catch (e: unknown) {
      fail(`Avatar start failed: ${(e as { message?: string })?.message || "unknown error"}.`);
    }
  }, [status, fail, markSpeaking]);

  const stop = useCallback(() => {
    teardown();
    setIsSpeaking(false);
    setStatus("idle");
  }, [teardown]);

  const clearError = useCallback(() => setError(null), []);

  const setMuted = useCallback((m: boolean) => {
    if (audioRef.current) audioRef.current.muted = m;
  }, []);

  // Tear down on unmount.
  useEffect(() => () => teardown(), [teardown]);

  return { status, isSpeaking, error, videoRef, audioRef, start, stop, clearError, setMuted };
}

export default useSimliProfessor;
